// app.js - Profesyonel Fiyat Takip Motoru
const SUPABASE_URL = 'https://apidenfvezstmpbbxser.supabase.co';
const SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWRlbmZ2ZXpzdG1wYmJ4c2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTQ0NjQsImV4cCI6MjA5Mjc5MDQ2NH0.MFebJX4cHNxMZCKss2y3YM4FJmegbGKyVP0R8M2qtNM
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchBinancePrices() {
    try {
        // Binance'den en güncel fiyatları tek seferde çekiyoruz
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
        for (let sym of symbols) {
            const res = await fetch(`https://api.binance.com/api/v1/ticker/price?symbol=${sym}`);
            const data = await res.json();
            
            if (sym === 'BTCUSDT') document.getElementById('btc-price').innerText = `$${parseFloat(data.price).toLocaleString()}`;
            if (sym === 'ETHUSDT') document.getElementById('eth-price').innerText = `$${parseFloat(data.price).toLocaleString()}`;
            if (sym === 'SOLUSDT') document.getElementById('sol-price').innerText = `$${parseFloat(data.price).toLocaleString()}`;
        }
        console.log("✅ Fiyatlar Binance'den güncellendi.");
    } catch (e) {
        console.error("❌ Fiyat hatası:", e);
    }
}

// FEED LİSTESİ (Supabase)
async function fetchFeed() {
    const { data, error } = await _supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(15);
    if (error) return;
    
    const list = document.getElementById('main-feed');
    list.innerHTML = '';
    data.forEach(tx => {
        list.innerHTML += `
            <div class="feed-item">
                <div class="item-info">
                    <strong>${tx.whale_name}</strong>
                    <span class="chain-tag">${tx.token_symbol}</span>
                </div>
                <div class="item-amount">
                    ${tx.amount} ${tx.token_symbol}
                </div>
            </div>
        `;
    });
}

// Başlat
setInterval(fetchBinancePrices, 10000); // 10 saniyede bir güncelle
fetchBinancePrices();
fetchFeed();
