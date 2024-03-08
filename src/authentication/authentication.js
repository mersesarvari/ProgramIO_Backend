const authentication = () => {
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
  //var serviceAccount = require("../firebase-creds.json");

  const registerSchema = Joi.object({
    username: Joi.string().max(50).min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(5)
      .required()
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]+$")
      )
      .message(
        "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, and one number."
      ),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  function Setup(credentials, databaseUrl) {
    const database = admin.firestore();
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      databaseURL: databaseUrl,
    });
  }
  const CreateUser = (username, email, password) => {
    return {
      id: guid(),
      username: username,
      email: email,
      password: password,
      registrationDate: new Date(),
      activationDate: null,
      activated: false,
      role: 0,
    };
  };

  const login = async (email, password) => {
    try {
      const result = loginSchema.validate(req.body);

      if (result.error) {
        return res
          .status(400)
          .send("You must enter a valid email and password!");
      } else {
        const loginUser = {
          email: req.body.email,
          password: req.body.password,
        };
        //Firebase connection and login
        const users = await getAll("/user"); // Assuming "/user" is the path to your user collection
        console.log("users", users);
        // Check if there is a user with the provided email and password
        const user = await users.find(
          (user) =>
            user.email === email.email && user.password === email.password
        );

        if (user) {
          console.log("Login successful");
          return user;
        } else {
          console.log("Invalid email or password");
          throw new Error("Invalid email or password");
        }
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
  //Creating th local user object

  const register = async (username, email, password) => {
    try {
      const result = registerSchema.validate({ username, email, password });

      if (result.error) {
        throw new Error("One of the validations is not good. Please fix it.");
      }
      const newUser = CreateUser(
        req.body.username,
        req.body.email,
        req.body.password
      );

      //Firebase connection and data registration
      if (!newUser) {
        console.log("You must provide the document ID and updated data!");
        return;
      }
      const dataRef = database.collection(url).doc(guid()).set(data);
      return res.status(200).send(dataRef.value);
    } catch (error) {
      return error.message;
    }
  };
};

module.exports = authentication;
