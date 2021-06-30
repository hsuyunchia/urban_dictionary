import React from "react";
import {useQuery,useLazyQuery} from "@apollo/react-hooks";

import Card from "../Components/Card";

const Cards = ({data}) => {
	if(!data.length){
		return(
			<div><p id="general-title">σ`∀´)σㄇ有東東</p></div>
		);
	}
	let list = [];
	let num = data.length;
	const cmp = (a, b) => {
		let numa = a.props.agree_users.length - a.props.disagree_users.length;
		let numb = b.props.agree_users.length - b.props.disagree_users.length;
		return numb - numa;
	}
	for(let i = 0; i < num; i++){
		// console.log(i,data[i].if_publish);
		list.push(
			<Card 
				vocabulary={data[i].vocabulary}
				author={data[i].author}
				explanation={data[i].explanation}
				example={data[i].example}
				tags={data[i].tags}
				agree_users={data[i].agree_users}
				disagree_users={data[i].disagree_users}
				create_date={data[i].create_date}
				published={(data[i].if_publish === true || data[i].if_publish === false) ? data[i].if_publish : null}
				post_id={data[i]._id}
				key={data[i]._id}
			/>
		);
	}
	// console.log(list);
	list.sort(cmp);
	return (
		<div>
			{list}
		</div>
	)
};

export default Cards;