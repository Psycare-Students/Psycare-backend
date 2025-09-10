import mongoose from "mongoose";

const WellnessArticleSchema = new mongoose.Schema({
    title: {type: String,required: true},
    content: {type: String,required: true},
    author: {type: String,required: true},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now}
});

const WellnessArticle = mongoose.model('WellnessArticle', WellnessArticleSchema);

export default WellnessArticle;