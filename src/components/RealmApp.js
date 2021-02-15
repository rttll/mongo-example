import React from "react";
import * as Realm from "realm-web";
import moment from 'moment'

const RealmAppContext = React.createContext();

export const useRealmApp = () => {
  const app = React.useContext(RealmAppContext);
  if (!app) {
    throw new Error(
      `You must call useRealmApp() inside of a <RealmAppProvider />`
    );
  }
  return app;
};

export const RealmAppProvider = ({ appId, children }) => {
  const [app, setApp] = React.useState(new Realm.App(appId))
  const client = React.useRef(null)

  React.useEffect(() => {
    setApp(new Realm.App(appId));
  }, [appId]);
  
  async function _setup() {
    if ( client.current !== null ) return;
    client.current = await app.currentUser.mongoClient("mongodb-atlas")
    // setClient(mongoClient)
    // console.log('client', client)
  }

  // Wrap the Realm.App object's user state with React state
  const [currentUser, setCurrentUser] = React.useState(app.currentUser);
  async function logIn(credentials) {
     // TODO: Call the logIn() method with the given credentials
    // If successful, app.currentUser is the user that just logged in
    setCurrentUser(app.currentUser);
  }
  async function logOut() {
    // Log out the currently active user
     // TODO: Call the logOut() method on the current user. 
    // If another user was logged in too, they're now the current user.
    // Otherwise, app.currentUser is null.
     // TODO: Call the setCurrentUser() method on the app's current user.
  }

  async function getDays() {
    await _setup()
    const collection = client.current.db("mealplanner").collection("days");
    let days = await collection.find({})
    return days
    // return days.map(obj => { return {...obj, ...{date: moment(obj.date)}} })
  }

  const createDay = async (date) => {
    await _setup()
    let days = await getDays()
    let id = days.length === 0 ? 1 : days.pop()._id + 1
    // todo cache collection
    const collection = client.current.db("mealplanner").collection("days");
    try {
      const result = await collection.insertOne({
        _id: id,
        user_id: app.currentUser.id,
        date: date,
        mealIds: [],
        mealOrder: [],
      })
      // todo remove second request here
      return await getOneDay(id)
    } catch (error) {
      return {error}
    }

  }

  const getOneDay = async (id) => {
    await _setup()
    const collection = client.current.db("mealplanner").collection("days");
    const day = await collection.findOne({_id: parseInt(id)})
    const mealsCollection = client.current.db("mealplanner").collection("meals");
    const meals = await mealsCollection.find( { _id: { $in: day.mealIds } })
    day.meals = meals
    return { day }
  }  

  const wrapped = { ...app, currentUser, logIn, logOut, getDays, getOneDay, createDay };
  
  return (
    <RealmAppContext.Provider value={wrapped}>
      {children}
    </RealmAppContext.Provider>
  );
};