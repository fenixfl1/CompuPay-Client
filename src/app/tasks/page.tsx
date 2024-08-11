"use client"

import { NextPage } from "next"
import React, { useEffect } from "react"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import useGetTagList from "@/services/hooks/tasks/useGetTagList"

const page: NextPage = () => {
  const { mutate: getTag } = useGetTagList()

  useEffect(() => {
    getTag([
      {
        condition: "A",
        field: "STATE",
        dataType: "str",
        operator: "=",
      },
    ])
  }, [])

  return (
    <>
      <TaskList />
      <TaskForm />
    </>
  )
}

export default page
