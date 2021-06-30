import { gql } from '@apollo/client';

export const SUB_SUBSCRIBE_CARD = gql`
    subscription subscribeCard($post_id: String!){
        subscribeCard(
            post_id: $post_id
        ){
            success
            agree_users
            disagree_users
        }
    }
`
export const SUB_NEW_VOCAB_OPTIONS = gql`
    subscription{
        newVocabOptions(number:0)
        {
            value
        }
    }
`