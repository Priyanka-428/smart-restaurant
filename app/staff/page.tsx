'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type Dish = {
  id: number
  name: string
  price: number
  image_url: string
  is_available: boolean
  notify_count: number
}

export default function StaffDashboard() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchDishes()

    const channel = supabase
      .channel('dishes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dishes' },
        () => {
          fetchDishes()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    }
  }

  async function fetchDishes() {
    const { data, error } = await supabase.from('dishes').select('*')
    if (error) {
      console.log('Error fetching dishes:', error)
    } else {
      setDishes(data as Dish[])
    }
  }
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }
async function addNewDish(e: React.FormEvent) {
    e.preventDefault()

    if (!newName || !newPrice) {
      alert('Please fill in at least the name and price')
      return
    }

    const { error } = await supabase.from('dishes').insert([
      {
        name: newName,
        price: parseFloat(newPrice),
        image_url: newImageUrl,
        is_available: true,
      },
    ])

    if (error) {
      console.log('Error adding dish:', error)
    } else {
      setNewName('')
      setNewPrice('')
      setNewImageUrl('')
      fetchDishes()
    }
  }
  async function toggleAvailability(id: number, currentStatus: boolean) {
    const newStatus = !currentStatus
    const updateData: { is_available: boolean; notify_count?: number } = {
      is_available: newStatus,
    }

    // Reset notify count when marking a dish available again
    if (newStatus === true) {
      updateData.notify_count = 0
    }

    const { error } = await supabase
      .from('dishes')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.log('Error updating dish:', error)
    } else {
      fetchDishes() // refresh the list after updating
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Staff Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer' }}
        >
          Log Out
        </button>
      </div>
      {dishes.filter((d) => !d.is_available).length > 0 && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          ⚠️ {dishes.filter((d) => !d.is_available).length} dish(es) currently unavailable — consider restocking soon.
        </div>
      )}
      <form onSubmit={addNewDish} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Add New Dish</h2>
        <input
          type="text"
          placeholder="Dish name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.6rem', marginBottom: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.6rem', marginBottom: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.6rem', marginBottom: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#2196f3', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Add Dish
        </button>
      </form>
      <div>
        {dishes.map((dish) => (
          <div
            key={dish.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
           <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{dish.name}</h2>
              <p style={{ margin: '0.3rem 0' }}>₹{dish.price}</p>
              {dish.notify_count > 0 && (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#ff9800', fontWeight: 'bold' }}>
                  🔔 {dish.notify_count} customer(s) waiting
                </p>
              )}
            </div>
            <button
              onClick={() => toggleAvailability(dish.id, dish.is_available)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: dish.is_available ? '#4caf50' : '#f44336',
                color: 'white',
              }}
            >
              {dish.is_available ? 'Available (tap to mark unavailable)' : 'Unavailable (tap to mark available)'}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}