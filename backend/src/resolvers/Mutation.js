const Mutation = {

    // 若初次登入(資料庫沒有這個email)則存資訊到DB，回傳使用者資訊。
    async userLogin(parent, {name, email}, { db }, info) {
        const user = await db.UserModel.findOne({email:email})
        if(!user){
            const tmp = new db.UserModel({name:name, email:email})
            return await tmp.save();
        }
        return user;
    },

    // 拿到 email，檢查筆名沒重複，改筆名，成功回傳 true，否則 false。
    async modifyPenName(parent, {email, penName}, { db }, info) {
        if(penName.length === 0){
            return {success:false, message:'筆名不可以為空'}
        }
        const duplicate = await db.UserModel.findOne({penName:penName})
        if(!duplicate){
            try {
                const res = await db.UserModel.updateOne(
                   { email : email },
                   { $set: { penName : penName } }
                );
                console.log("res:", res)
                if(res["nModified"] === 1){
                    return {success:true, message:'成功更改！'}
                }
                else{
                    return {success:false, message:'Email帳號不存在'}
                }
            } catch (e) {
                return {success:false, message:'DB error.'}
            }
        }
        else{
            return {success:false, message:'這個筆名已經有人用過了，換一個吧~'}
        }
    },

    // 檢查某些欄位非空，存入DB
    async createPost(parent, {email, vocabulary, explanation, example, tags}, { db, pubsub }, info){
        const user_id = await db.UserModel.findOne({email})
        var dt = new Date();
        dt = String(dt).substring(4, 15)

        if(tags){
            const tmp = new db.PostModel({
                author: user_id,
                vocabulary, explanation, example, tags, 
                if_publish: true, 
                agree_users: [], 
                disagree_users: [], 
                create_date: dt
            })
            const res = await tmp.save();

            const op = await db.PostModel.aggregate( [
                { $match: { if_publish: true }},
                { $group : { _id : "$vocabulary" } } 
            ])
            const options = []
            op.map((dict)=>{
                options.push({value: dict._id})
            })
            pubsub.publish('NEW_OPTIONS', {newVocabOptions: options})

            return res
        }
        else {
            const tmp = new db.PostModel({
                author: user_id,
                vocabulary, explanation, example,
                if_publish: true, 
                agree_users: [], 
                disagree_users: [], 
                create_date: dt
            })
            const res = await tmp.save();

            const op = await db.PostModel.aggregate( [
                { $match: { if_publish: true }},
                { $group : { _id : "$vocabulary" } } 
            ])
            const options = []
            op.map((dict)=>{
                options.push({value: dict._id})
            })
            pubsub.publish('NEW_OPTIONS', {newVocabOptions: options})

            return res
        }
    },

    // 拿到ID及修改內容，存入DB。
    async modifyPost( parent, {post_id, vocabulary, explanation, example, tags}, { db }, info ){
        const mutate = {};
        if (vocabulary){ mutate['vocabulary'] = vocabulary}///////////
        if (explanation){ mutate['explanation'] = explanation}
        if (example){ mutate['example'] = example}
        if (tags) { mutate['tags'] = tags}
        console.log("[Mutation] modifyPost mutate dict:", mutate)

        if(Object.keys(mutate).length){
            try {
                const res = await db.PostModel.updateOne(
                    { _id : post_id },
                    { $set: mutate }
                );
                return {success:true, message:'Successfully modified.'}
            } catch (e) {
                return {success:false, message:'Post id 不存在'}
            }
        }
        else{
            return {success:false, message:'No mutation data.'}
        }
    },
    
    // 拿到ID，修改 if_publish 屬性。
    async unpublishPost( parent, {post_id}, { db, pubsub }, info){
        try {
            const res = await db.PostModel.updateOne(
                { _id : post_id },
                { $set: {if_publish: false} }
            );
            if(res["nModified"] === 1){

                const op = await db.PostModel.aggregate( [
                    { $match: { if_publish: true }},
                    { $group : { _id : "$vocabulary" } } 
                ])
                const options = []
                op.map((dict)=>{
                    options.push({value: dict._id})
                })
                pubsub.publish('NEW_OPTIONS', {newVocabOptions: options})

                return {success:true, message:'成功隱藏'}
            }
            else{
                return {success:false, message:'隱藏失敗'}
            }
        } catch (e) {
            return {success:false, message:'DB error'}
        }
    },

    async publishPost( parent, {post_id}, { db, pubsub }, info){
        try {
            const res = await db.PostModel.updateOne(
                { _id : post_id },
                { $set: {if_publish: true} }
            );
            if(res["nModified"] === 1){

                const op = await db.PostModel.aggregate( [
                    { $match: { if_publish: true }},
                    { $group : { _id : "$vocabulary" } } 
                ])
                const options = []
                op.map((dict)=>{
                    options.push({value: dict._id})
                })
                pubsub.publish('NEW_OPTIONS', {newVocabOptions: options})

                return {success:true, message:'成功發布'}
            }
            else{
                return {success:false, message:'發布失敗'}
            }
        } catch (e) {
            return {success:false, message:'DB error'}
        }
    }, 

    async clickAgree( parent, {post_id, email}, { db, pubsub }, info ){
        const post = await db.PostModel.findById(post_id)
        let disagree = [... post['disagree_users']]
        let agree = [... post['agree_users']]

        const index_d = disagree.indexOf(email);
        const index_a = agree.indexOf(email);
        // 原本在 A => 收回
        if(index_a !== -1){
            agree.splice(index_a, 1);
        }
        else{
            // 原本在 D => 刪 D
            if (index_d !== -1){
                disagree.splice(index_d, 1);
            }
            // 增 A
            agree.push(email)
        }

        try {
            const res = await db.PostModel.updateOne(
                { _id : post_id },
                { $set: {agree_users: agree, disagree_users: disagree} }
            );
            if(res["nModified"] === 1){
                const to_return = {success:true, agree_users: agree, disagree_users: disagree }
                pubsub.publish(`${post_id}`, {subscribeCard: to_return} )
                return to_return;
            }
            else{
                return {success:false,agree_users: agree, disagree_users: disagree }
            }
        } catch (e) {
            return {success:false, agree_users: agree, disagree_users: disagree }
        }
    },

    async clickDisagree( parent, {post_id, email}, { db, pubsub }, info ){
        const post = await db.PostModel.findById(post_id)
        let disagree = [... post['disagree_users']]
        let agree = [... post['agree_users']]

        const index_d = disagree.indexOf(email);
        const index_a = agree.indexOf(email);
        // 原本在 D => 收回
        if(index_d !== -1){
            disagree.splice(index_d, 1);
        }
        else{
            // 原本在 A => 刪 A
            if (index_a !== -1){
                agree.splice(index_a, 1);
            }
            // 增 D
            disagree.push(email)
        }

        try {
            const res = await db.PostModel.updateOne(
                { _id : post_id },
                { $set: {agree_users: agree, disagree_users: disagree} }
            );
            if(res["nModified"] === 1){
                const to_return = {success:true, agree_users: agree, disagree_users: disagree }
                pubsub.publish(`${post_id}`, {subscribeCard: to_return} )
                return to_return;
            }
            else{
                return {success:false, agree_users: agree, disagree_users: disagree }
            }
        } catch (e) {
            return {success:false, agree_users: agree, disagree_users: disagree }
        }
    },

    async deleteByVocab( parent, {vocabulary}, { db }, info ){
        await db.PostModel.deleteMany({vocabulary: vocabulary})
        return true
    }

};

export default Mutation;
