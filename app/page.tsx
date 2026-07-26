'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Dish = {
  id: number
  name: string
  price: number
  image_url: string
  is_available: boolean
  notify_count: number
}

export default function Home() {
  const [dishes, setDishes] = useState<Dish[]>([])

  useEffect(() => {
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

  async function fetchDishes() {
    const { data, error } = await supabase.from('dishes').select('*')
    if (error) {
      console.log('Error fetching dishes:', error)
    } else {
      setDishes(data as Dish[])
    }
  }

  async function notifyMe(id: number, currentCount: number) {
    const { error } = await supabase
      .from('dishes')
      .update({ notify_count: currentCount + 1 })
      .eq('id', id)

    if (error) {
      console.log('Error updating notify count:', error)
    } else {
      alert("We'll let the kitchen know you're interested!")
      fetchDishes()
    }
  }

  return (
    <main
      style={{
        padding: 'clamp(1.5rem, 5vw, 3rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#FFF8F0',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            marginBottom: '0.5rem',
            color: '#7A3B1D',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}
        >
          🍽️ Our Menu
        </h1>
        <p style={{ color: '#A97155', fontSize: '1rem' }}>
          Freshly made, served with love
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {dishes.map((dish) => (
          <div
            key={dish.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #F0DFCB',
              borderRadius: '16px',
              padding: '1rem',
              boxShadow: '0 4px 12px rgba(122, 59, 29, 0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <img
              src={dish.image_url}
              alt={dish.name}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
            <h2
              style={{
                fontSize: '1.15rem',
                margin: '0.85rem 0 0.35rem',
                color: '#5A2E15',
                fontWeight: 600,
              }}
            >
              {dish.name}
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#C1622C',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              ₹{dish.price}
            </p>
            <p
              style={{
                display: 'inline-block',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.25rem 0.7rem',
                borderRadius: '999px',
                backgroundColor: dish.is_available ? '#E6F4EA' : '#FBE8E6',
                color: dish.is_available ? '#2E7D32' : '#C62828',
              }}
            >
              {dish.is_available ? '✅ Available' : '❌ Out of Stock'}
            </p>
            {!dish.is_available && (
              <button
                onClick={() => notifyMe(dish.id, dish.notify_count)}
                style={{
                  marginTop: '0.6rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#C1622C',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                🔔 Notify me when available
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}