const Query = {
    async queryByString( parent, {str}, { db }, info ){
        if(str.length === 0){
            return []
        }
        // 處理特殊字元
        const element = ["|", "*", "(", ")", "+", '\\',  "$", "^", "[", "[]", "."]
        var test1 = element.some(el => str.includes(el));
        // console.log(test1)
        if(test1){
            const res = await db.PostModel.find({
                vocabulary: str, 
                if_publish: true
            })
            return res
        }
        else{
            const res =  await db.PostModel.find( 
                { vocabulary: { $regex: new RegExp(str, "i")}, if_publish: true} //test upper lower case
            );
            return res
        }
    },

    async queryByUser( parent, {penName}, { db }, info ){
        const author_id = await db.UserModel.findOne({penName: penName})
        const res =  await db.PostModel.find( 
            { author: author_id, if_publish: true} //test upper lower case
        );
        return res
    },

    async queryByVocabulary( parent, {vocabulary}, { db }, info ){
        if(vocabulary.length === 0){
            return []
        }
        // 處理特殊字元
        const element = ["|", "*", "(", ")", "+", '\\',  "$", "^", "[", "[]", "."]
        var test1 = element.some(el => vocabulary.includes(el));
        // console.log(test1)
        if(test1){
            const res = await db.PostModel.find({
                vocabulary: vocabulary, 
                if_publish: true
            })
            // .sort({agree_users:-1})
            return res
        }
        else{
            const res =  await db.PostModel.find( 
                { vocabulary: {$regex: new RegExp('^' + vocabulary+'$', 'i')}, if_publish: true }
                // { vocabulary: new RegExp(vocabulary, "i")} //test upper lower case
            );
            return res
        }
    },

    async queryMyPost( parent, {email}, { db }, info ){
        const author_id = await db.UserModel.findOne({email: email})
        const res =  await db.PostModel.find( 
            { author: author_id} 
        );
        return res
    },

    async randomFivePosts( parent, args, { db }, info ){

        return await db.PostModel.aggregate([
            { $match: { if_publish: true } },
            { $sample: { size: 5 } }
        ])
    },

    async queryById(parent,{id},{db},info){
        return await db.PostModel.findOne({_id: id});
    },

    async getVocabOptions(parent, args, {db}, info){
        const res = await db.PostModel.aggregate( [
            { $group : { _id : "$vocabulary" } } 
        ])
        const to_return = []
        res.map((dict)=>{
            to_return.push({value: dict._id})
        })

        return to_return
    }
};

export default Query;
