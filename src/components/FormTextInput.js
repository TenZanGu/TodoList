import React from 'react'
import TextInput from './TextInput'

export default function FormTextInput({
  id,
  placeholder,
  value,
  onChange,
  type,
  onKeyPress,
}) {
  return (
    <TextInput
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      type={type}
    />
  )
}
