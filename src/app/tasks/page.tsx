"use client"

import { NextPage } from "next"
import React, { useEffect } from "react"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import useGetTagList from "@/services/hooks/tasks/useGetTagList"
import useTaskStore from "@/stores/taskStore"
import ConditionalComponent from "@/components/ConditionalComponent"
import useModalStore from "@/stores/modalStore"

const page: NextPage = () => {
  const { resetStore } = useTaskStore()
  const { visible } = useModalStore()
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

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, [])

  return (
    <>
      <TaskList />
      <ConditionalComponent condition={visible}>
        <TaskForm />
      </ConditionalComponent>
    </>
  )
}

export default page
