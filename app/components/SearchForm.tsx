import React from 'react'
import Form from 'next/form';
import { useState } from 'react';

const SearchForm = () => {

  return (
   <Form action='/' scroll={false} className='search-form'>
    <input 
    name='query'
    defaultValue=''
    className='search-input'
    placeholder='search travel stories'/>


   <button type='submit' className='search-btn'>S</button>
   </Form>
  )
}

export default SearchForm
