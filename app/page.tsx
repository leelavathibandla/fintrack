'use client'
import { useState } from 'react'

export default function Home() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')

  const addExpense = () => {
    if (!amount || !title) return
    setExpenses([...expenses, { id: Date.now(), title, amount: Number(amount) }])
    setAmount('')
    setTitle('')
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <main style={{padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial'}}>
      <h1>FinTrack 💰</h1>
      <h2>Total: ₹{total}</h2>
      
      <div style={{marginBottom: '20px'}}>
        <input 
          placeholder="Expense name" 
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
        <button onClick={addExpense} style={{padding: '8px 16px'}}>Add</button>
      </div>

      <ul>
        {expenses.map(e => (
          <li key={e.id}>{e.title} - ₹{e.amount}</li>
        ))}
      </ul>
    </main>
  )
}
