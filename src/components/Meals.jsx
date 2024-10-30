import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";
import MealItem from "./MealItem";

const requestConfig = {};

export default function Meals(){
    const { data: meals, isLoading, error } = useHttp('http://localhost:3000/meals', requestConfig, []);
    
    if(isLoading){
        return <p className="center">Fetching meals...</p>
    }

    if(error){
        return <Error title="Failed to fetch meals" message={error}  />
    }

    if(!meals){
        return <p>No meals found.</p>
    }

    return(
        <ul id="meals">
            {
                meals.map(meal => (
                    <MealItem meal={meal} key={meal.id} />
                ))
            }
        </ul>
    )
}