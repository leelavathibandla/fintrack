'use client'
import { useState } from 'react'

type Item = { id: number, title: string, amount: number, type: 'income' | 'expense' }

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')

  const addItem = () => {
    if (!amount || !title) return
    setItems([...items, { id: Date.now(), title, amount: Number(amount), type }])
    setAmount('')
    setTitle('')
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const income = items.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0)
  const expense = items.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0)
  const balance = income - expense

  return (
    <main style={{padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial'}}>
      <h1>FinTrack 💰</h1>
      <h2>Balance: ₹{balance}</h2>
      <p>Income: ₹{income} | Expense: ₹{expense}</p>
      
      <div style={{marginBottom: '20px'}}>
        <select value={type} onChange={(e) => setType(e.target.value as any)} style={{padding: '8px', marginRight: '10px'}}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input 
          placeholder="Name" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{padding: '8px', marginRight: '10px'}}
        />
        <input 
          placeholder="Amount" 
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{padding: '8px', marginRight: '10px'}}
        />
        <button onClick={addItem} style={{padding: '8px 16px'}}>Add</button>
      </div>

      <ul>
        {items.map(i => (
          <li key={i.id} style={{marginBottom: '8px'}}>
            {i.type === 'income' ? '📈' : '📉'} {i.title} - ₹{i.amount}
            <button onClick={() => deleteItem(i.id)} style={{marginLeft: '10px'}}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
