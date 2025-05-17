import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../features/transaction/transactionSlice'
import { fetchCategories } from '../features/category/categorySlice'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Stats() {
  const dispatch = useDispatch()
  const { items: txs } = useSelector((s) => s.transaction)
  const { items: cats } = useSelector((s) => s.category)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchTransactions())
  }, [dispatch])

  const filtered = txs.filter((tx) => {
    if (!from || !to) return true
    const d = new Date(tx.date)
    return d >= new Date(from) && d <= new Date(to)
  })

  const byDate = filtered.reduce((acc, tx) => {
    const delta = +tx.amount * (tx.type === 'expense' ? -1 : 1)
    acc[tx.date] = (acc[tx.date] || 0) + delta
    return acc
  }, {})
  const barData = Object.entries(byDate).map(([date, amount]) => ({ date, amount }))

  const catMap = Object.fromEntries(cats.map((c) => [c.id, c.title]))

  const pieByType = (type) => {
    const result = {}
    filtered.forEach((tx) => {
      if (tx.type === type) {
        result[tx.categoryId] = (result[tx.categoryId] || 0) + Number(tx.amount)
      }
    })
    return Object.entries(result).map(([key, value], i) => ({
      name: catMap[key] || key,
      value,
      color: COLORS[i % COLORS.length],
    }))
  }

  const pieIncome = pieByType('income')
  const pieExpense = pieByType('expense')

  return (
      <motion.div
          className="w-full h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow transition-colors duration-300">

        <h1 className="text-2xl font-bold mb-6">📊 Статистика</h1>

          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="block text-sm mb-1">С:</label>
              <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">По:</label>
              <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-2">Доходы</h2>
              <PieChart width={300} height={300}>
                <Pie
                    data={pieIncome}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieIncome.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold mb-2">Расходы</h2>
              <PieChart width={300} height={300}>
                <Pie
                    data={pieExpense}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieExpense.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </motion.div>
          </div>

          <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold mb-4">Динамика баланса</h2>
            <BarChart width={600} height={300} data={barData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount">
                {barData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </motion.div>
        </div>
      </motion.div>
  )
}
