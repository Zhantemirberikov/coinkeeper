import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCategories,
  addCategory,
  removeCategory,
} from '../features/category/categorySlice'
import { motion, AnimatePresence } from 'framer-motion'

export default function Settings() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((s) => s.category)
  const [newCat, setNewCat] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleAdd = async () => {
    if (newCat.trim()) {
      await dispatch(addCategory(newCat))
      setNewCat('')
    }
  }

  return (
      <motion.div
          className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">⚙️ Управление категориями</h1>

          <div className="flex mb-6 gap-2">
            <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Новая категория"
                className="flex-1 border p-2 rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <button
                type="button"
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Добавить
            </button>
          </div>

          {status === 'loading' && <p>Загрузка...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="space-y-3">
            <AnimatePresence>
              {items.map((cat) => (
                  <motion.li
                      key={cat.id}
                      className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded shadow transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                  >
                    <span>{cat.title}</span>
                    <button
                        type="button"
                        onClick={() => dispatch(removeCategory(cat.id))}
                        className="text-red-500 hover:underline text-sm"
                    >
                      Удалить
                    </button>
                  </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </motion.div>
  )
}
