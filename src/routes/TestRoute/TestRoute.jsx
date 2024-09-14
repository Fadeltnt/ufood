import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function TestRoute() {
  const [restos, setRestos] = useState([]);
  const [counter, setCounter] = useState(0);

  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      axios
        .get("https://ufoodapi.herokuapp.com/unsecure/restaurants?limit=130")
        .then((res) => res.data.items),
  });

  useEffect(() => {
    console.log("im mounted");
    return () => {
      console.log("im unmounted");
    };
  }, []);

  useEffect(() => {
    if (genresQuery.isSuccess) {
      setRestos(genresQuery.data);
    }
  }, [genresQuery.isSuccess, genresQuery.data]);

  const handleOnclick = () => {
    setCounter((prev) => {
      return prev + 1;
    });
  };

  return (
    genresQuery.isSuccess && (
      <div>
        <button className="mt-10" onClick={handleOnclick}>
          Click me
        </button>
        <h1>{counter}</h1>
        {restos.map((resto, index) => (
          <h1 key={index}>{resto.name}</h1>
        ))}
      </div>
    )
  );
}
