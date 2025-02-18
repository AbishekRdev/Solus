import mongoose, {Schema} from "mongoose";




const clusterSchema=new Schema({},{timestamps:true});


export const Cluster=mongoose.model("Cluster",clusterSchema);

