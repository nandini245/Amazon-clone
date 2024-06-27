const Products = require("./models/product_schema")
const productsdata = require("./constant/productsdata")


const DefaultData = async()=>{
    try{
           await Products.deleteMany({});
           const stroreData = await Products.insertMany(productsdata);
           console.log(stroreData);
    }
    catch(e)
    {
        console.log(e)

    }
};

module.exports = DefaultData;