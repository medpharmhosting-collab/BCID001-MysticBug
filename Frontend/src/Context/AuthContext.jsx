import { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config.js"
// firebase config 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

// --- Context ---
const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [gender, setGender] = useState(null)
  const [isProfileAdded, setIsProfileAdded] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const navigate = useNavigate()

  const shouldNavigateToRole = useRef(false);
  const expectedRole = useRef(null);
  const authSource = useRef(null);

  // Restore session from localStorage on app load
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedProfile = localStorage.getItem("isProfileAdded");
      const storedUid = localStorage.getItem("uid");
      const storedUserName = localStorage.getItem("userName");
      const storedRole = localStorage.getItem("role");
      const storedGender = localStorage.getItem("gender");
      const storedPhoneNumber = localStorage.getItem("phoneNumber");

      // Restore profile state
      if (storedProfile && storedProfile !== "undefined") {
        setIsProfileAdded(JSON.parse(storedProfile));
      } else {
        setIsProfileAdded(false);
      }

      // If we have a backend token, restore the session
      if (storedToken && storedUid && storedRole) {
        authSource.current = "backend";
        setToken(storedToken);
        setUid(storedUid);
        setRole(storedRole);
        setUserName(storedUserName || "User");
        setUser(storedUserName || "User");
        setGender(storedGender || "");
        setPhoneNumber(storedPhoneNumber || "");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  const clearSession = () => {
    setUser(null);
    setUid(null);
    setRole(null);
    setToken(null);
    setUserName(null);
    setGender(null);
    setIsProfileAdded(false);
    setPhoneNumber("");
    shouldNavigateToRole.current = false;
    expectedRole.current = null;
    authSource.current = null;

    // Clear all localStorage items
    localStorage.removeItem("authToken");
    localStorage.removeItem("isNewUser");
    localStorage.removeItem("uid");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("gender");
    localStorage.removeItem("isProfileAdded");
  };
  const navigateByRole = (r) => {
    if (r === "patient") navigate("/patient-dashboard");
    else if (r === "doctor") navigate("/doctor-dashboard");
    else if (r === "investor") navigate("/investor-dashboard");
    else if (r === "admin") navigate("/admin-dashboard");
    else navigate("/");
  };

  const manualLogin = (userId, userName, userRole, token, isProfileAdded = false, gender = "", phoneNumber = "") => {
    // Set authSource FIRST to prevent race conditions with onAuthStateChanged
    authSource.current = "backend";

    setUid(userId);
    setUser(userName);
    setUserName(userName);
    setRole(userRole);
    setIsProfileAdded(isProfileAdded);
    setToken(token);
    setGender(gender);
    setPhoneNumber(phoneNumber);

    // Store all session data in localStorage for all user types
    localStorage.setItem("authToken", token);
    localStorage.setItem("uid", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("role", userRole);
    localStorage.setItem("gender", gender || "");
    localStorage.setItem("phoneNumber", phoneNumber || "");

    if (isProfileAdded !== undefined) {
      localStorage.setItem("isProfileAdded", JSON.stringify(isProfileAdded));
    }

    if (userRole) {
      navigateByRole(userRole);
    } else {
      shouldNavigateToRole.current = true;
    }
  };

  // (clears backend session)
  const manualLogout = async () => {
    // set user inactive  
    if (uid && authSource.current === "backend") {
      try {
        await fetch(`${BASE_URL}/users/set-active`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ uid, isActive: false }),
        });
      } catch (err) {
        console.warn("set-active failed", err);
      }
    }
    clearSession();
    // Do not sign out firebase here if firebase session belongs to another user; but if firebase signed-in user exists and authSource === 'firebase', sign out that too:
    if (authSource.current === "firebase" && firebaseAuth.currentUser) {
      try {
        await signOut(firebaseAuth);
      } catch (err) {
        console.warn("firebase signout failed", err);
      }
    }
    navigate("/login");
  };
  const firebaseSocialSignIn = async (providerName) => {
    let result;
    if (providerName === "google") {
      const provider = new GoogleAuthProvider();
      result = await signInWithPopup(firebaseAuth, provider);
    } else if (providerName === "apple") {
      const provider = new OAuthProvider("apple.com");
      provider.addScope("email");
      provider.addScope("name");
      provider.setCustomParameters({ locale: "en" });
      result = await signInWithPopup(firebaseAuth, provider);
    } else {
      throw new Error("Unknown provider");
    }

    // mark authSource as firebase  
    authSource.current = "firebase_social";
    // get firebase user details 
    const fbUser = result.user;
    const fbUid = fbUser.uid;
    const fbEmail = fbUser.email || "";
    const fbName = fbUser.displayName || "";

    // return firebase payload to POST to backend /users/social-login
    return { fbUser, fbUid, fbEmail, fbName };
  };

  // -------------------------
  // onAuthStateChanged: listen to firebase changes
  // Only for Firebase social login users, not for backend email/password users
  // -------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      // CRITICAL: If backend session exists, ignore all firebase events
      if (authSource.current === "backend") {
        setLoading(false);
        return;
      }

      // No firebase user
      if (!currentUser) {
        // Don't clear backend session
        if (authSource.current === "backend") {
          setLoading(false);
          return;
        }
        clearSession();
        setLoading(false);
        return;
      }

      // Firebase user exists - only process for firebase social logins
      if (authSource.current !== "firebase_social") {
        setLoading(false);
        return;
      }

      // This is a firebase social login - fetch user data from backend
      authSource.current = "firebase";

      try {
        const displayName = currentUser.displayName || "User";
        setUser(displayName);
        setUid(currentUser.uid);

        // Fetch role from backend
        const res = await fetch(`${BASE_URL}/users/getUserRole?uid=${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setRole(data.userType);
          setUserName(data.name);
          setGender(data.gender || "");
          setIsProfileAdded(data.isProfileAdded || false);
        } else {
          setRole(null);
          setUserName(displayName);
        }
      } catch (err) {
        console.error("Error fetching role for firebase user", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (role && shouldNavigateToRole.current) {
      shouldNavigateToRole.current = false;

      // validate expectedRole if present
      if (expectedRole.current && expectedRole.current !== role) {
        const attempted = expectedRole.current;
        expectedRole.current = null;
        alert(`You are registered as a ${role}. Please use the ${role} login instead of ${attempted} login.`);
        // if firebase session exists, sign out
        if (firebaseAuth.currentUser) signOut(firebaseAuth);
        clearSession();
        return;
      }

      expectedRole.current = null;

      // finally navigate
      navigateByRole(role);
    }
  }, [role, navigate, userName]);


  const setUserActive = async (userId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/users/set-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userId,
          isActive: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error setting user active status:", error);
    }
  };
  const updateAuthUser = (updatedFields) => {
    if (updatedFields.isProfileAdded !== undefined) {
      setIsProfileAdded(updatedFields.isProfileAdded);
      localStorage.setItem("isProfileAdded", JSON.stringify(updatedFields.isProfileAdded));
    }
    if (updatedFields.gender !== undefined) {
      setGender(updatedFields.gender);
      localStorage.setItem("gender", updatedFields.gender);
    }
    if (updatedFields.userName !== undefined) {
      setUserName(updatedFields.userName);
      setUser(updatedFields.userName);
      localStorage.setItem("userName", updatedFields.userName);
    }
    if (updatedFields.phoneNumber !== undefined) {
      setPhoneNumber(updatedFields.phoneNumber);
      localStorage.setItem("phoneNumber", updatedFields.phoneNumber);
    }
  };
  return (
    <FirebaseContext.Provider
      value={{
        user,
        uid,
        role,
        token,
        loading,
        userName,
        shouldNavigateToRole,
        expectedRole,
        isProfileAdded,
        gender,
        phoneNumber,
        updateAuthUser,
        // helpers
        setUserActive,
        firebaseSocialSignIn, // internal firebase sign-in (returns fb payload)
        manualLogin,
        manualLogout,
        clearSession,
        authSource,
        signOutFirebase: async () => {
          authSource.current = null;
          try { await signOut(firebaseAuth); } catch (e) { }
          clearSession();
        },
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => useContext(FirebaseContext);
