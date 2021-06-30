const Subscription = {
    subscribeCard:{
        subscribe( parent, {post_id}, {pubsub}, info){
            return pubsub.asyncIterator(`${post_id}`);
        }
    }, 

    newVocabOptions:{
        subscribe( parent, {number}, {pubsub}, info ){
            return pubsub.asyncIterator('NEW_OPTIONS');
        }
    }
}

export default Subscription