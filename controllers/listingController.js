import Listing from "../models/listingmodel.js"

const createListing = async (req,res) =>{
    try {
        const newList = await Listing.create(req.body);
        return res.status(200).json(newList)
    } catch (error) {
        return res.status(500).json({"message" : "Something went wrong during creating the list"})
    }
}

const deleteListing = async(req,res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return res.status(404).json({"message" : "Listing is not present"})
        }
        // console.log(req.user.id);
        // console.log(listing.useRef);
        if(req.user.id !== listing.useRef){
            return res.status(400).json({"message" : "Not Authrorized"})
        }

        await Listing.findByIdAndDelete(req.params.id)
        return res.status(200).json({"message" : "Listing has been deleted"})
    } catch (error) {
        return res.status(500).json({"Message" : "Something went wrong during deletion of listing"})
    }
}

const updateListing = async (req,res) =>{
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id);
        if(!listing){
            return res.status(404).json({"message" : "Listing is not found for update"})
        }

        if(req.user.id !== listing.useRef){
            return res.status(401).json({"message" : "Not Authorized for Updating the listing"})
        }

        await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        return res.status(200).json({"message" : "Updated Successfully"})
    } catch (error) {
        console.log(error);
    }
}

const getListing = async(req,res) =>{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer

        if(offer === undefined || offer === 'false'){
            offer = { $in: [false,true]};
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in: [false, true]}
        }

        let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);

    } catch (error) {
        return res.status(504).json({"message" : "Problem in getting details"})
    }
}

export {createListing, deleteListing, updateListing, getListing}