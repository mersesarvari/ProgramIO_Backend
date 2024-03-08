// Import the functions you need from the SDKs you need
const { getAnalytics } = require("firebase/analytics");
const admin = require("firebase-admin");
const {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
} = require("firebase/firestore");
const { v4: guid } = require("uuid");

var serviceAccount = require("../firebase-creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://nightworkstest-default-rtdb.europe-west1.firebasedatabase.app",
});

const database = admin.firestore();

const create = async (url, data) => {
  //Error handling
  if (!data) {
    console.log("You must provide the document ID and updated data!");
    return;
  }
  console.log("Modify called");
  const dataRef = database.collection(url).doc(guid()).set(data);
  return dataRef;
};
const update = async (url, documentId, updatedData) => {
  //Error handling
  if (!documentId || !updatedData) {
    console.log("You must provide the document ID and updated data!");
    return;
  }
  console.log("Modify called");
  const dataRef = database.collection(url).doc(documentId).update(updatedData);
  return dataRef;
};
const remove = async (url, documentId) => {
  if (!documentId) {
    console.log("You must provide the document ID to delete!");
    return;
  }

  try {
    await removeFirebase(ref(database, `/${url}/${documentId}`));
  } catch (error) {
    return error.message;
  }
};
const getAll = async (url) => {
  console.log("getAll called");
  const dataRef = database.collection(url);
  const response = await dataRef.get();
  let responseArr = [];

  response.forEach((doc) => {
    responseArr.push(doc.data());
  });
  return responseArr;
};
const getOne = async (url, id) => {
  console.log("getOne called");
  const dataRef = database.collection(url).doc(id);
  const response = await dataRef.get();
  return response.data();
};

const login = async (email, password) => {
  console.log("login called:", email, password);

  const users = await getAll("/user"); // Assuming "/user" is the path to your user collection
  console.log("users", users);
  // Check if there is a user with the provided email and password
  const user = await users.find(
    (user) => user.email === email.email && user.password === email.password
  );

  if (user) {
    console.log("Login successful");
    return user;
  } else {
    console.log("Invalid email or password");
    throw new Error("Invalid email or password");
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  remove,
  update,
  login,
};
