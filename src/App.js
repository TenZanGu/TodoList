import './App.css'
import React, { useState, useEffect } from 'react'
import FormTitle from './components/FormTitle'
import FormTextInput from './components/FormTextInput'
import LoadingScreen from './components/LoadingScreen'
import fetchData from './utils/fetchData'
import getRandomId from './utils/getRandomId'

const LIST_URL =
  'https://gist.githubusercontent.com/amsul/3b6edcbb9bbc42b231089b6ebad38cb9/raw/6cfee9781998199548f579d0082f3d3a05f20321/data.json'

export default function App() {
  const [taskList, setTaskList] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const onChangeNewTaskHandler = e => {
    const updatednewTask = { ...newTask }
    updatednewTask['label'] = e.target.value
    setNewTask(updatednewTask)
  }
  useEffect(() => {
    let itemList = localStorage.getItem('taskList')
    if (itemList) {
      setTaskList(JSON.parse(itemList))
      setLoading(false)
    } else {
      fetchData(LIST_URL).then(value => {
        setLoading(false)
        setTaskList(value)
      })
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList))
    setNewTask({ label: '' })
  }, [taskList])
  const addItem = () => {
    if (newTask.label.trim() !== '') {
      const newTaskList = [...taskList]
      newTask['id'] = getRandomId()
      newTask['completed'] = false
      newTaskList.push(newTask)
      setTaskList(newTaskList)
    }
  }
  const enterAddingItem = event => {
    if (event.which === 13 || event.keyCode === 13) {
      addItem()
    }
  }
  const removeItem = id => {
    let newTaskList = [...taskList]
    newTaskList = newTaskList.filter(function(obj) {
      return obj.id !== id
    })
    setTaskList(newTaskList)
  }
  const finishedTask = id => {
    let newTaskList = [...taskList]
    let obj = newTaskList.find(o => o.id === id)
    obj.completed = !obj.completed
    setTaskList(newTaskList)
  }
  const loadingContent = loading ? (
    <LoadingScreen />
  ) : (
    <TodoList
      tasklist={taskList}
      newTask={newTask.label}
      onChangeNewTask={onChangeNewTaskHandler}
      addItem={addItem}
      enter={enterAddingItem}
      removeItem={removeItem}
      finishedTask={finishedTask}
    />
  )
  return (
    <div className='App'>
      <div className='App-Content'>
        <div>
          <FormTitle>To-Do List</FormTitle>
          {loadingContent}
          {/* Put your solution here 👇 */}
        </div>
      </div>
    </div>
  )
}
const TodoList = props => {
  return (
    <div>
      {props.tasklist.map(task => (
        <Task
          title={task.label}
          key={task.id}
          id={task.id}
          completed={task.completed}
          removeItem={props.removeItem}
          finishedTask={props.finishedTask}
          addItem={props.addItem}
        />
      ))}
      <div className='NewTask'>
        <FormTextInput
          value={props.newTask}
          className='NewTask_Input'
          onChange={props.onChangeNewTask}
          onKeyPress={props.enter}
        />
        <button className='NewTask_Button' onClick={props.addItem}>
          Add Item
        </button>
      </div>
    </div>
  )
}
const Task = props => {
  let classTaskInput = []
  classTaskInput.push('Task_input')
  if (props.completed === true) {
    classTaskInput.push('Task_input-stroke')
  }
  return (
    <div className='Task'>
      <input
        name='isGoing'
        checked={props.completed}
        type='checkbox'
        onChange={props.finishedTask.bind(this, props.id)}
        onKeyPress={props.addItem}
      />
      <p className={classTaskInput.join(' ')}>{props.title}</p>
      <button
        className='Task_delete'
        onClick={props.removeItem.bind(this, props.id)}
      >
        Delete
      </button>
    </div>
  )
}
