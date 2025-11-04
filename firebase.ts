import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ATENÇÃO: Substitua isto pela configuração do seu próprio projeto Firebase.
// Você pode encontrar essas informações no console do Firebase, nas configurações do seu projeto.
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Cloud Firestore e obtém uma referência ao serviço
export const db = getFirestore(app);
