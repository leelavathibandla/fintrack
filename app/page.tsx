'use client'
import { useState, useEffect } from 'react'

type Item = { id: number, title: string, amount: number, type: 'income' | 'expense' }

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')

  useEffect(() => {
    const saved = localStorage.getItem('fintrack-data')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('fintrack-data', JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!amount ||!title) return
    setItems([...items, { id: Date.now(), title, amount: Number(amount), type }])
    setAmount('')
    setTitle('')
  }

  const deleteItem = (id: number) => {
    setItems(items.filter(i => i.id!== id))
  }

  const income = items.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0)
  const expense = items.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0)
  const balance = income - expense

  // Chart ki %
  const total = income + expense
  const incomePer = total > 0? (income / total) * 100 : 0
  const expensePer = total > 0? (expense / total) * 100 : 0

  return (
    <main style={{padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial', background: '#f5f5f5', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center'}}>FinTrack 💰 Pro + Charts</h1>

      {/* Cards */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px'}}>
        <div style={{background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
          <p style={{margin: 0, color: '#666'}}>Balance</p>
          <h2 style={{margin: '5px 0', color: balance >= 0? 'green' : 'red'}}>₹{balance}</h2>
        </div>
        <div style={{background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
          <p style={{margin: 0, color: '#666'}}>Income</p>
          <h2 style={{margin: '5px 0', color: 'green'}}>₹{income}</h2>
        </div>
        <div style={{background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
          <p style={{margin: 0, color: '#666'}}>Expense</p>
          <h2 style={{margin: '5px 0', color: 'red'}}>₹{expense}</h2>
        </div>
      </div>

      {/* NEW CHART SECTION */}
      <div style={{background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginTop: 0}}>Income vs Expense</h3>
        <div style={{height: '30px', background: '#eee', borderRadius: '15px', display: 'flex', overflow: 'hidden'}}>
          <div style={{width: `${incomePer}%`, background: 'green', transition: 'width 0.3s'}}></div>
          <div style={{width: `${expensePer}%`, background: 'red', transition: 'width 0.3s'}}></div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px'}}>
          <span>🟢 Income {incomePer.toFixed(0)}%</span>
          <span>🔴 Expense {expensePer.toFixed(0)}%</span>
        </div>
      </div>

      {/* Add Form */}
      <div style={{background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
        <select value={type} onChange={(e) => setType(e.target.value as any)} style={{padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
          <option value="expense">📉 Expense</option>
          <option value="income">📈 Income</option>
        </select>
        <input placeholder="Name - Salary, Coffee" value={title} onChange={(e) => setTitle(e.target.value)} style={{padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}/>
        <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}/>
        <button onClick={addItem} style={{padding: '12px', width: '100%', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}}>Add</button>
      </div>

      {/* List */}
      <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginTop: 0}}>Transactions</h3>
        {items.length === 0 && <p style={{color: '#999'}}>No transactions yet</p>}
        {items.map(i => (
          <div key={i.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee'}}>
            <span>{i.type === 'income'? '📈' : '📉'} {i.title}</span>
            <span style={{color: i.type === 'income'? 'green' : 'red', fontWeight: 'bold'}}>₹{i.amount}</span>
            <button onClick={() => deleteItem(i.id)} style={{background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Delete</button>
          </div>
        ))}
      </div>
    </main>
  )
}
