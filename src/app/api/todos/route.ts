import { NextResponse, NextRequest } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";
// const API_KEY: string = process.env.API_KEY

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function GET() {
  try {
    const res = await fetch(DATA_SOURCE_URL);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const todos: Todo[] = await res.json();

    return NextResponse.json(todos);
  } catch (e) {
    return NextResponse.error().json();
  }
}

export async function DELETE(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { id }: Partial<Todo> = await req.json();

  if (!id) return NextResponse.json({ messge: "Todo id Required" });

  try {
    await fetch(`${DATA_SOURCE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // 'API-KEy':API_KEY
      },
    });
    return NextResponse.json({ message: `Todo ${id} deleted` });
  } catch (e) {
    NextResponse.json(e);
  }
}

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { userId, title }: Partial<Todo> = await req.json();

  if (!userId || !title)
    return NextResponse.json({ message: "Missing required data" });

  const res = await fetch(DATA_SOURCE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'API-KEy':API_KEY
    },
    body: JSON.stringify({
      userId,
      title,
      completed: false,
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newTodo: Todo = await res.json();
  return NextResponse.json(newTodo);
}

// export async function PUT(req: Request) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const { id, userId, title }: Partial<Todo> = await req.json();

//   if (!userid || !title)
//     return NextResponse.json({ message: "Missing required data" });

//   const res = await fetch(DATA_SOURCE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // 'API-KEy':API_KEY
//     },
//     body: JSON.stringify({
//       userId,
//       title,
//       completed: false,
//     }),
//   });

//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const newTodo: Todo = await res.json();
//   return NextResponse.json(newTodo);
// }
