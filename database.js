import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: "127.0.0.1",
    database: "webbuilder",
    user: "admin",
    password: "Adminwlijo123##",
  },
});

export default async function execQuery(qq) {
  try {
    let result = await db.query(qq);
    await db.end();
    return result;
  } catch (error) {
    console.log(error);
  }
}
