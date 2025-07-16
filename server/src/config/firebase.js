import admin from 'firebase-admin';

export const initializeFirebase = () => {
  try {
    // In production, use service account key file
    // For demo, we'll use a mock configuration
    const serviceAccount = {
      type: "service_account",
      project_id: "demo-project",
      private_key_id: "demo-key-id",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\n-----END PRIVATE KEY-----\n",
      client_email: "demo@demo-project.iam.gserviceaccount.com",
      client_id: "123456789",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/demo%40demo-project.iam.gserviceaccount.com"
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('🔥 Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // For demo purposes, we'll continue without Firebase
    console.log('⚠️  Running in demo mode without Firebase authentication');
  }
};

export { admin };