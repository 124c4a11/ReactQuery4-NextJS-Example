import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { InferGetStaticPropsType } from "next";

interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const getTodos = async () =>
  (
    await axios.get<ITodo[]>(
      "https://jsonplaceholder.typicode.com/users/1/todos"
    )
  ).data;

export default function Home() {
  const { data } = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  return (
    <>
      <h1>Home</h1>

      {!!data?.length && (
        <ul>
          {data.map(({ id, title }) => (
            <li key={id}>{title}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["todos"], getTodos);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
