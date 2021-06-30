import { gql } from '@apollo/client';

const QUE_QUERY_BY_STRING=gql`
	query queryByString($str: String!){
		queryByString(str: $str){
			_id,
			author{
				_id,
				name,
				penName
			},
			vocabulary,
			explanation,
			example,
			tags,
			agree_users,
			disagree_users,
			create_date
		}
	}
`;

const QUE_QUERY_BY_VOCABULARY=gql`
	query queryByVocabulary($vocabulary: String!){
		queryByVocabulary(vocabulary: $vocabulary){
			_id,
			author{
				_id,
				name,
				penName
			},
			vocabulary,
			explanation,
			example,
			tags,
			agree_users,
			disagree_users,
			create_date
		}
	}
`;

const QUE_QUERY_BY_USER=gql`
	query queryByUser($penName: String!){
		queryByUser(penName: $penName){
			_id,
			author{
				_id,
				name,
				penName
			},
			vocabulary,
			explanation,
			example,
			tags,
			agree_users,
			disagree_users,
			create_date
		}
	}
`;

const QUE_RANDOM_FIVE_POSTS=gql`
	query randomFivePosts($number: Int){
		randomFivePosts(number: $number){
			_id,
			author{
				_id,
				name,
				penName
			},
			vocabulary,
			explanation,
			example,
			tags,
			agree_users,
			disagree_users,
			create_date
		}
	}
`;

const QUE_QUERY_MY_POST=gql`
	query queryMyPost($email: String!){
		queryMyPost(email: $email){
			_id,
			author{
				_id,
				name,
				penName
			},
			if_publish,
			vocabulary,
			explanation,
			example,
			tags,
			agree_users,
			disagree_users,
			create_date
		}
	}
`;

const QUE_QUERY_BY_ID=gql`
	query queryById($id: ID!){
		queryById(id: $id){
			_id,
			author{
				email
				penName
			},
			vocabulary,
			explanation,
			example,
			tags,
		}
	}
`;

const QUE_GET_VOCAB_OPTIONS=gql`
	query{
		getVocabOptions(number:0){
			value
		}
	}
`

export {QUE_QUERY_BY_STRING, QUE_QUERY_BY_VOCABULARY, QUE_QUERY_BY_USER, QUE_RANDOM_FIVE_POSTS, QUE_QUERY_MY_POST, QUE_QUERY_BY_ID, QUE_GET_VOCAB_OPTIONS };
