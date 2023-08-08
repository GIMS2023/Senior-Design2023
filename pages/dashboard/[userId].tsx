import Head from "next/head"
import { parseCookies } from "nookies";
import React from "react";
import TableExample from "@/components/itemTable";

const DOMAIN = process.env.DOMAIN;

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  const { userId } = context.params;
  const fs = require('fs');
  
  let dash = false;

  // Check if token exists
  if (token) {
    const jwt = require('jsonwebtoken');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token matches user id
    if (decodedToken.id === userId) {
      dash = true;
    }
  }

  const responseItems = await fetch(DOMAIN + `/api/getItems`, {
    method: 'POST',
    body: JSON.stringify({ userId, pageNumber: 1 }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const responseCategories = await fetch(DOMAIN + `/api/getCategories`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  const dataItems = await responseItems.json()
  const dataCategories = await responseCategories.json()

  // for (let i = 0; i < dataItems.items.length; i++) {
  //   if (dataItems.items[i].images != null) {
  //     // console.log(dataItems.items[i].images.toString());
  //     dataItems.items[i].images = dataItems.items[i].images.toString('base64');
  //   }
  // }

  return {
    props: {
      dash : dash,
      userId: userId,
      items: dataItems.items,
      totalItems: dataItems.totalItems,
      categories: dataCategories.categories
    }
  }
}

export default function Dashboard({ dash, userId, items, totalItems, categories }) {

  if (!dash) {
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <div>
          <h1>Access Denied</h1>
        </div>
      </>
    )
  }

  return (
    // <>
    //   <Head>
    //     <title>Dashboard</title>
    //   </Head>
    //   <div>
    //     <h1>Dashboard</h1>
    //   </div>
    //   <div>
    //     <h2>Add Item</h2>
    //     <form action="/api/addItem" method="post">
    //       <label htmlFor="name">Name</label>
    //       <input type="text" id="name" name="name" />
    //       <input type="hidden" name="userId" value={userId} />
    //       <button type="submit">Add Item</button>
    //     </form>
    //   </div>
    // </>
   <TableExample userId={userId} items={items} totalItems={totalItems} categories={categories} />

  )
}

