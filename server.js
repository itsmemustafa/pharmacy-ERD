import app from "./app.js";
import prisma from "./src/lib/prisma.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();