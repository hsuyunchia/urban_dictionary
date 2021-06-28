import React from 'react';
import '../App.css';
import {Typography} from '@material-ui/core';
import {ThumbUp, ThumbDown} from '@material-ui/icons';
import { Space, Input, Button } from 'antd';
import { NavLink} from "react-router-dom";


const Card=({vocabulary,author,explanation,example,tags,agree_users,disagree_users,create_date})=>{
	let vocabLink="/define/"+vocabulary;
	let authorLink="/author/"+author.penName;
	return (
		<div className="card">
			{/*<div className="tags">#tag1 #tag2</div>*/}
			<div className="vocab">
				<p className="word"><NavLink to={vocabLink}>{vocabulary}</NavLink></p>
			</div>
			<div className="meaning">釋義：{explanation}</div>
			<div className="example">例句：{example}</div>
			<div className="author"> </div>
			<div className="card-footer"> 
				<Button >
					<Space size={4}> 
						<ThumbUp color="primary" />
						<Typography variant="button" display="block" gutterBottom >{agree_users.length}</Typography>
					</Space>
				</Button>
				<Button >
					<Space size={4}> 
						<ThumbDown color="primary" />
						<Typography variant="button" display="block" gutterBottom >{disagree_users.length}</Typography>
					</Space>
				</Button>
			</div>
			<div className="card-footer" > 
				<div className="text">由 
					<NavLink to={authorLink}>{author.penName}</NavLink>
				</div>
				<div className="text">創建於 {create_date}</div>
			</div>
		</div>
	);
}

export default Card;