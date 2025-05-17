import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../features/transaction/transactionSlice'
import { fetchCategories } from '../features/category/categorySlice'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { items: txs, status: txStatus } = useSelector((s) => s.transaction)
  const { items: cats } = useSelector((s) => s.category)

  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    categoryId: '',
    date: '',
    comment: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ ...form })

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchTransactions())
  }, [dispatch])

  const balance = txs.reduce((sum, tx) => {
    const amt = Number(tx.amount) || 0
    return tx.type === 'income' ? sum + amt : sum - amt
  }, 0)

  const handleFormChange = (e, isEdit = false) => {
    const setter = isEdit ? setEditForm : setForm
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(addTransaction(form))
    setForm({ type: 'income', amount: '', categoryId: '', date: '', comment: '' })
  }

  const startEdit = (tx) => {
    setEditingId(tx.id)
    setEditForm({ ...tx })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    await dispatch(updateTransaction({ id: editingId, ...editForm }))
    setEditingId(null)
  }

  return (
      <motion.div
          className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300 px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
      >
        <div className="max-w-4xl mx-auto space-y-10">
          <div>
            <h2 className="text-2xl font-bold">💼 Текущий баланс</h2>
            <motion.p
                className={`text-3xl font-semibold mt-2 flex items-center gap-2 ${
                    balance > 0
                        ? 'text-green-500'
                        : balance < 0
                            ? 'text-red-600'
                            : 'text-gray-500'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
              {balance.toLocaleString()} ₸
              {balance < 0 && <span className="text-xl">💀</span>}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 rounded shadow-md bg-white dark:bg-gray-800 transition-colors duration-300">
            <h3 className="text-lg font-semibold">Добавить транзакцию</h3>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Тип</label>
                <select name="type" value={form.type} onChange={handleFormChange} className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                  <option value="income">Доход</option>
                  <option value="expense">Расход</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Сумма</label>
                <input type="number" name="amount" value={form.amount} onChange={handleFormChange} required className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Категория</label>
                <select name="categoryId" value={form.categoryId} onChange={handleFormChange} required className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                  <option value="">— Выберите —</option>
                  {cats.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Дата</label>
                <input type="date" name="date" value={form.date} onChange={handleFormChange} required className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Комментарий</label>
              <input name="comment" value={form.comment} onChange={handleFormChange} className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
            </div>
            <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Добавить
            </button>
          </form>

          <div>
            <h3 className="text-xl font-semibold mb-4">📋 Последние транзакции</h3>
            {txStatus === 'loading' ? (
                <p>Загрузка...</p>
            ) : (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {txs.slice(0, 10).map((tx) => {
                      const category = cats.find((c) => c.id === tx.categoryId)?.title || '—'
                      const isEditing = tx.id === editingId

                      return (
                          <motion.li
                              key={tx.id}
                              className="p-4 rounded shadow-md bg-white dark:bg-gray-800 transition-colors duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.3 }}
                          >
                            {isEditing ? (
                                <form onSubmit={saveEdit} className="space-y-2">
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    <select name="type" value={editForm.type} onChange={(e) => handleFormChange(e, true)} className="input" />
                                    <input name="amount" value={editForm.amount} onChange={(e) => handleFormChange(e, true)} className="input" />
                                    <select name="categoryId" value={editForm.categoryId} onChange={(e) => handleFormChange(e, true)} className="input" />
                                    <input name="date" type="date" value={editForm.date} onChange={(e) => handleFormChange(e, true)} className="input" />
                                    <input name="comment" value={editForm.comment} onChange={(e) => handleFormChange(e, true)} className="input" />
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Сохранить</button>
                                    <button type="button" onClick={cancelEdit} className="text-gray-500 hover:underline">Отмена</button>
                                  </div>
                                </form>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <div className="font-medium">{tx.comment || '(без комментария)'}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {tx.date} — {category}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                            <span className={`text-lg font-semibold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.type === 'income' ? '+' : '-'}{Number(tx.amount).toLocaleString()} ₸
                            </span>
                                    <button type="button" onClick={() => startEdit(tx)} className="text-blue-500 hover:underline text-sm">Редактировать</button>
                                    <button type="button" onClick={() => dispatch(deleteTransaction(tx.id))} className="text-red-500 hover:underline text-sm">Удалить</button>
                                  </div>
                                </div>
                            )}
                          </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
            )}
          </div>
        </div>
      </motion.div>
  )
}
