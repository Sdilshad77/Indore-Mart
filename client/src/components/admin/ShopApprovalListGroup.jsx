import React from 'react'
import { useDispatch } from 'react-redux'
import { shopUpdate } from '../../features/admin/adminSlice'

/* ─── Gen-Z ShopApprovalListGroup ───────────────────────────────────────────
   Dark glass · emerald neon · consistent with IndoreMart Admin Dashboard
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .sal-wrap {
    font-family: 'DM Sans', sans-serif;
    border-radius: 18px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.28s ease;
  }
  .sal-wrap:hover { border-color: rgba(52,211,153,0.12); }

  /* head */
  .sal-head {
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;
  }
  .sal-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.95rem; color: #f0f0f5;
  }
  .sal-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 0.2rem 0.65rem; border-radius: 999px;
  }
  .sal-badge.pending {
    background: rgba(251,191,36,0.1); color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.22);
  }
  .sal-badge.clear {
    background: rgba(52,211,153,0.1); color: #34d399;
    border: 1px solid rgba(52,211,153,0.22);
  }
  .sal-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: currentColor;
    animation: sal-blink 1.6s ease-in-out infinite;
  }
  @keyframes sal-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  /* body */
  .sal-body { padding: 0.3rem 0; }

  /* row */
  .sal-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 1.4rem; gap: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.22s ease;
  }
  .sal-row:last-child { border-bottom: none; }
  .sal-row:hover { background: rgba(52,211,153,0.025); }

  .sal-row-left { display: flex; align-items: flex-start; gap: 0.75rem; min-width: 0; }

  .sal-icon {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sal-row:hover .sal-icon { transform: scale(1.1) rotate(-4deg); }

  .sal-info { min-width: 0; }

  .sal-shop-name {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.9rem; color: #f0f0f5;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 0.18rem;
    transition: color 0.22s ease;
  }
  .sal-row:hover .sal-shop-name { color: #34d399; }

  .sal-owner {
    font-size: 0.72rem; color: rgba(180,220,200,0.42); margin-bottom: 0.12rem;
  }
  .sal-address {
    font-size: 0.7rem; color: rgba(180,220,200,0.3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
    margin-bottom: 0.3rem;
  }

  /* status chip */
  .sal-status {
    display: inline-block;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 0.14rem 0.5rem; border-radius: 5px;
  }
  .sal-status.pending  { background: rgba(251,191,36,0.1); color:#fbbf24; border:1px solid rgba(251,191,36,0.2); }
  .sal-status.rejected { background: rgba(255,60,80,0.1);  color:#ff6b7a; border:1px solid rgba(255,60,80,0.2); }
  .sal-status.review   { background: rgba(96,165,250,0.1); color:#60a5fa; border:1px solid rgba(96,165,250,0.2); }

  /* action buttons */
  .sal-actions { display: flex; flex-direction: column; gap: 0.4rem; flex-shrink: 0; }

  .sal-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.38rem 0.8rem; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.72rem;
    border: none; cursor: pointer; white-space: nowrap;
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, background 0.22s ease;
  }
  .sal-btn-approve {
    background: rgba(52,211,153,0.12); color: #34d399;
    border: 1px solid rgba(52,211,153,0.25);
  }
  .sal-btn-approve:hover {
    background: rgba(52,211,153,0.22);
    transform: scale(1.07);
    box-shadow: 0 0 14px rgba(52,211,153,0.2);
  }
  .sal-btn-reject {
    background: rgba(255,60,80,0.08); color: #ff6b7a;
    border: 1px solid rgba(255,60,80,0.18);
  }
  .sal-btn-reject:hover {
    background: rgba(255,60,80,0.18);
    transform: scale(1.07);
    box-shadow: 0 0 12px rgba(255,60,80,0.15);
  }

  /* empty */
  .sal-empty {
    padding: 2.5rem 1rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  }
  .sal-empty-icon { font-size: 2rem; opacity: 0.4; }
  .sal-empty-text { font-size: 0.82rem; color: rgba(180,220,200,0.3); }
`

const ShopApprovalListGroup = ({ allShops = [] }) => {
  const dispatch = useDispatch()
  const approvalList = allShops.filter(shop => shop.status !== 'accepted')

  const handleShopUpdate = shopDetails => dispatch(shopUpdate(shopDetails))

  const getStatusCls = s =>
    s === 'rejected' ? 'rejected' : s === 'review' ? 'review' : 'pending'

  return (
    <>
      <style>{css}</style>
      <div className="sal-wrap">

        {/* head */}
        <div className="sal-head">
          <div className="sal-title">Pending Approvals</div>
          {approvalList.length > 0 ? (
            <span className="sal-badge pending">
              <span className="sal-badge-dot" />
              {approvalList.length} pending
            </span>
          ) : (
            <span className="sal-badge clear">All clear</span>
          )}
        </div>

        {/* body */}
        <div className="sal-body">
          {approvalList.length > 0 ? approvalList.map(shop => (
            <div key={shop._id} className="sal-row">
              <div className="sal-row-left">
                <div className="sal-icon">🏪</div>
                <div className="sal-info">
                  <div className="sal-shop-name">{shop.name}</div>
                  <div className="sal-owner">Owner: {shop.user?.name}</div>
                  {shop.address && (
                    <div className="sal-address">{shop.address}</div>
                  )}
                  <span className={`sal-status ${getStatusCls(shop.status)}`}>
                    {shop.status}
                  </span>
                </div>
              </div>

              <div className="sal-actions">
                <button
                  className="sal-btn sal-btn-approve"
                  onClick={() => handleShopUpdate({ shopId: shop._id, status: 'accepted' })}
                >
                  <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  className="sal-btn sal-btn-reject"
                  onClick={() => handleShopUpdate({ shopId: shop._id, status: 'rejected' })}
                >
                  <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          )) : (
            <div className="sal-empty">
              <div className="sal-empty-icon">✅</div>
              <div className="sal-empty-text">No pending approvals</div>
            </div>
          )}
        </div>

      </div>
    </>
  )
}

export default ShopApprovalListGroup