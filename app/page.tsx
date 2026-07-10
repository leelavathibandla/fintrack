'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type Transaction = {
  id: number
  name: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

const CATEGORIES = {
  income: ['Salary', 'Business', 'Freelance', 'Other'],
  expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Other']
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560']

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('Food')

  useEffect(() => {
    const saved = localStorage.getItem('fintrack')
    if (saved) setTransactions(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('fintrack', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    setCategory(CATEGORIES[type][0])
  }, [type])

  const addTransaction = () => {
    if (!name ||!amount) return
    const newTransaction: Transaction = {
      id: Date.now(),
      name,
      amount: Number(amount),
      type,
      category,
      date: new Date().toLocaleDateString()
    }
    setTransactions([newTransaction,...transactions])
    setName('')
    setAmount('')
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id!== id))
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const chartData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpense }
  ]

  const categoryData = CATEGORIES.expense.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0)

  return (
    <main style={{padding: '20px', maxWidth: '1000px', margin: '0 auto', background: '#f5f5f5', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center'}}>FinTrack 💰 + Categories</h1>

      {/* Add Transaction Form */}
      <div style={{background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
        <h2>Add Transaction</h2>
        <div style={{display: 'grid', gap: '10px'}}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}/>
          <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}/>

          <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} style={{padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}>
            {CATEGORIES[type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <button onClick={addTransaction} style={{padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Add</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3>Income</h3>
          <p style={{color: 'green', fontSize: '24px', fontWeight: 'bold'}}>₹{totalIncome}</p>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3>Expense</h3>
          <p style={{color: 'red', fontSize: '24px', fontWeight: 'bold'}}>₹{totalExpense}</p>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center'}}>
          <h3>Balance</h3>
          <p style={{color: balance >= 0? 'green' : 'red', fontSize: '24px', fontWeight: 'bold'}}>₹{balance}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '10px'}}>
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#0070f3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{background: 'white', padding: '20px', borderRadius: '10px'}}>
          <h3>Expense by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{background: 'white', padding: '20px', borderRadius: '10px'}}>
        <h2>Transactions</h2>
        {transactions.map(t => (
          <div key={t.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee'}}>
            <div>
              <strong>{t.name}</strong> - <span style={{fontSize: '12px', background: '#eee', padding: '2px 8px', borderRadius: '10px'}}>{t.category}</span>
              <div style={{fontSize: '12px', color: '#666'}}>{t.date}</div>
            </div>
            <div>
              <span style={{color: t.type === 'income'? 'green' : 'red', fontWeight: 'bold'}}>₹{t.amount}</span>
              <button onClick={() => deleteTransaction(t.id)} style={{marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
