import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import Styled from "styled-components";

const GET_MOVIE = gql`
	query getMovie($movieId: String!) {
		movie(id: $movieId) {
			id
			title
			rating
			medium_cover_image
			description_intro
			isLiked @client
		}
	}
`;

const Container = Styled.div`
	height: 100vh;
	background-image: linear-gradient(-45deg, #d754ab, #fd723a);
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	color: white;
`;

const Column = Styled.div`
	margin-left: 10px;
	width: 50%;
`;

const Title = Styled.h1`
	font-size: 65px;
	margin-bottom: 15px;
`;

const Subtitle = Styled.h4`
	font-size: 35px;
	margin-bottom: 10px;
`;

const Description = Styled.p`
	font-size: 12px;
`;

const Poster = Styled.div<{ bg: string }>`
	width: 25%;
	height: 50%;
	background-color: transparent;
	background-image: url(${props => props.bg});
	background-size: cover;
	background-position: center center;
	border-radius: 7px;
`;

const Button = Styled.button`
	background-color: transparent;
	border: none;
	font-size: 30px;
	font-weight: 600;
	color: white;
`;

export default function Movie() {
	const { id } = useParams();
	const {
		data,
		loading,
		client: { cache },
	} = useQuery(GET_MOVIE, {
		variables: { movieId: id },
	});

	const onClick = () => {
		// ! Fragment : Piece of Type
		console.log(cache);
		cache.writeFragment({
			id: `Movie:${id}`,
			fragment: gql`
				fragment LikedFragment on Movie {
					isLiked
				}
			`,
			data: {
				isLiked: !data.movie.isLiked,
			},
		});
	};

	return (
		<Container>
			<Column>
				<Title>{loading ? "Loading..." : data?.movie?.title}</Title>
				<Subtitle>⭐ {data?.movie?.rating}</Subtitle>
				<Button onClick={onClick}>{data?.movie?.isLiked ? "Liked❤️" : "Unliked"}</Button>
				<Description>{data?.movie?.description_intro}</Description>
			</Column>
			<Poster bg={data?.movie?.medium_cover_image} />
		</Container>
	);
}
