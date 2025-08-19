import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.Db_url, {
            dbName: "ChatbotYT",
        });

        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

export { connectDb };

