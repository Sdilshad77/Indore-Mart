import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addProduct, updateProduct } from "../../features/shop/shopSlice"
import { X, Upload, Package } from "lucide-react"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .apm-overlay {
    position: fixed; inset: 0; z-index: 50;
    display: flex; align-items: center; justify-content: center;
    padding: 12px;
    background: rgba(0,0,0,0.78);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: apm-fade 0.18s ease;
  }
  @keyframes apm-fade { from{opacity:0} to{opacity:1} }

  .apm-modal {
    position: relative;
    width: 100%; max-width: 600px;
    background: #0a1410;
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: 18px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.7);
    display: flex; flex-direction: column;
    animation: apm-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes apm-up { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .apm-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    background: #0d1c16;
    border-bottom: 1px solid rgba(52,211,153,0.1);
    border-radius: 18px 18px 0 0;
    flex-shrink: 0;
  }
  .apm-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.1rem; color: #34d399; letter-spacing: -0.02em; margin: 0;
  }
  .apm-subtitle { margin: 2px 0 0; font-size: 0.73rem; color: rgba(120,180,150,0.45); }
  .apm-close {
    width: 30px; height: 30px; border-radius: 8px;
    border: 1px solid rgba(52,211,153,0.14);
    background: rgba(52,211,153,0.05);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(120,180,150,0.45);
    transition: background 0.2s, color 0.2s; flex-shrink: 0;
  }
  .apm-close:hover { background: rgba(52,211,153,0.12); color: #34d399; }

  .apm-body {
    padding: 16px 20px;
    display: flex; flex-direction: column; gap: 12px;
    flex: 1;
  }

  .apm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media(max-width:480px){ .apm-row-2 { grid-template-columns: 1fr; } }

  .apm-label {
    display: block; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(100,160,130,0.5);
    margin-bottom: 5px; font-family: 'DM Sans', sans-serif;
  }

  .apm-input, .apm-select, .apm-textarea {
    width: 100%; padding: 9px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(52,211,153,0.13);
    border-radius: 10px;
    color: #e7f6ee; font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .apm-input::placeholder, .apm-textarea::placeholder { color: rgba(100,150,120,0.3); }
  .apm-input:focus, .apm-select:focus, .apm-textarea:focus {
    border-color: rgba(52,211,153,0.38);
    box-shadow: 0 0 0 3px rgba(52,211,153,0.07);
  }
  .apm-select { appearance: none; -webkit-appearance: none; cursor: pointer; }
  .apm-select option { background: #0a1410; color: #e7f6ee; }
  .apm-textarea { resize: none; height: 68px; }

  .apm-price-wrap { position: relative; }
  .apm-price-sym {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: #34d399; font-weight: 700; font-size: 0.85rem; pointer-events: none;
  }
  .apm-price-wrap .apm-input { padding-left: 24px; }

  .apm-select-wrap { position: relative; }
  .apm-chevron {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    color: rgba(52,211,153,0.35); pointer-events: none;
  }

  .apm-upload-zone {
    border: 1.5px dashed rgba(52,211,153,0.18);
    border-radius: 11px; padding: 14px 16px;
    display: flex; align-items: center; gap: 14px;
    cursor: pointer;
    background: rgba(52,211,153,0.02);
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .apm-upload-zone:hover { border-color: rgba(52,211,153,0.38); background: rgba(52,211,153,0.05); }
  .apm-upload-icon {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    background: rgba(52,211,153,0.1);
    display: flex; align-items: center; justify-content: center;
    color: #34d399;
  }
  .apm-upload-text { flex: 1; }
  .apm-upload-title { font-size: 0.82rem; font-weight: 600; color: rgba(200,240,220,0.65); }
  .apm-upload-hint { font-size: 0.7rem; color: rgba(100,150,120,0.4); margin-top: 1px; }
  .apm-upload-filename { font-size: 0.72rem; color: #34d399; font-weight: 600; margin-top: 2px; }
  .apm-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }

  .apm-preview {
    width: 52px; height: 52px; border-radius: 10px; flex-shrink: 0;
    object-fit: cover; border: 1px solid rgba(52,211,153,0.2);
  }

  .apm-footer {
    display: flex; align-items: center; justify-content: flex-end; gap: 10px;
    padding: 12px 20px;
    border-top: 1px solid rgba(52,211,153,0.09);
    background: rgba(0,0,0,0.18);
    border-radius: 0 0 18px 18px;
    flex-shrink: 0;
  }
  .apm-btn-cancel {
    padding: 9px 18px; border-radius: 10px;
    border: 1px solid rgba(52,211,153,0.14);
    background: rgba(52,211,153,0.04);
    color: rgba(180,220,200,0.45);
    font-size: 0.82rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .apm-btn-cancel:hover { border-color: rgba(52,211,153,0.3); color: rgba(180,220,200,0.8); }
  .apm-btn-submit {
    padding: 9px 22px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #34d399, #059669);
    color: #030f07; font-size: 0.82rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: transform 0.18s, box-shadow 0.18s;
    display: flex; align-items: center; gap: 6px;
  }
  .apm-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(52,211,153,0.28); }
  .apm-btn-submit:active { transform: scale(0.98); }
`;

const categories = [
    { value: 'vegetables', label: '🥬 Vegetables' },
    { value: 'fruits',     label: '🍎 Fruits' },
    { value: 'dairy',      label: '🥛 Dairy & Eggs' },
    { value: 'bakery',     label: '🍞 Bakery' },
    { value: 'cloths',     label: '👕 Cloths' },
    { value: 'other',      label: '📦 Other' },
];

const AddProductModal = ({ showModal, handleModal }) => {
    const dispatch = useDispatch()
    const { shop, edit } = useSelector(state => state.shop)
    const [previewUrl, setPreviewUrl] = useState(null)

    // Lock background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const [formData, setFormData] = useState({
        name: "", description: "", productImage: "",
        category: "", price: "", stock: "", shopId: shop._id
    })

    const { name, description, category, price, stock, shopId } = formData

    const handleChange = (e) => {
        if (e.target.name === 'productImage') {
            const file = e.target.files[0]
            setFormData({ ...formData, productImage: file })
            if (file) setPreviewUrl(URL.createObjectURL(file))
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let fd = new FormData()
        fd.append('name', name)
        fd.append('description', description)
        fd.append('category', category)
        fd.append('price', price)
        fd.append('stock', stock)
        fd.append('shopId', shopId)
        fd.append('productImage', formData.productImage)

        !edit.isEdit
            ? dispatch(addProduct(fd))
            : dispatch(updateProduct({ _id: edit.product._id, ...formData }))

        setFormData({ name: "", description: "", productImage: "", category: "", price: "", stock: "", shopId: shop._id })
        setPreviewUrl(null)
        handleModal()
    }

    useEffect(() => {
        if (edit.isEdit) {
            setFormData(edit?.product)
            setPreviewUrl(edit?.product?.productImage || null)
        }
    }, [edit])

    return (
        <>
            <style>{css}</style>
            <div className="apm-overlay">
                <div className="apm-modal">

                    {/* Header */}
                    <div className="apm-header">
                        <div>
                            <h2 className="apm-title">{edit.isEdit ? 'Edit Product' : 'Add New Product'}</h2>
                            <p className="apm-subtitle">{edit.isEdit ? 'Update the product details below.' : 'Fill in the details to add a product to your shop.'}</p>
                        </div>
                        <button className="apm-close" onClick={handleModal} aria-label="Close">
                            <X style={{ width: 14, height: 14 }} />
                        </button>
                    </div>

                    {/* Body */}
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="apm-body">

                            {/* Product Name */}
                            <div>
                                <label className="apm-label">Product Name</label>
                                <input
                                    className="apm-input"
                                    name="name" value={name} onChange={handleChange}
                                    type="text" placeholder="e.g. Fresh Organic Tomatoes"
                                    required
                                />
                            </div>

                            {/* Category + Description */}
                            <div className="apm-row-2">
                                <div>
                                    <label className="apm-label">Category</label>
                                    <div className="apm-select-wrap">
                                        <select className="apm-select" name="category" value={category} onChange={handleChange} required>
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                        <svg className="apm-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <label className="apm-label">Description</label>
                                    <textarea
                                        className="apm-textarea"
                                        name="description" value={description} onChange={handleChange}
                                        placeholder="What makes this product special?"
                                    />
                                </div>
                            </div>

                            {/* Price + Stock */}
                            <div className="apm-row-2">
                                <div>
                                    <label className="apm-label">Price (₹)</label>
                                    <div className="apm-price-wrap">
                                        <span className="apm-price-sym">₹</span>
                                        <input
                                            className="apm-input"
                                            name="price" value={price} onChange={handleChange}
                                            type="number" placeholder="0" min="0" required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="apm-label">Stock Quantity</label>
                                    <input
                                        className="apm-input"
                                        name="stock" value={stock} onChange={handleChange}
                                        type="number" placeholder="0" min="0" required
                                    />
                                </div>
                            </div>

                            {/* Image Upload — horizontal compact layout */}
                            <div>
                                <label className="apm-label">Product Image</label>
                                <div className="apm-upload-zone">
                                    {previewUrl
                                        ? <img src={previewUrl} alt="Preview" className="apm-preview" />
                                        : (
                                            <div className="apm-upload-icon">
                                                <Upload style={{ width: 18, height: 18 }} />
                                            </div>
                                        )
                                    }
                                    <div className="apm-upload-text">
                                        <p className="apm-upload-title">Click to upload image</p>
                                        <p className="apm-upload-hint">PNG, JPG, WebP — up to 5MB</p>
                                        {formData.productImage && typeof formData.productImage !== 'string' && (
                                            <p className="apm-upload-filename">✓ {formData.productImage.name}</p>
                                        )}
                                    </div>
                                    <input
                                        className="apm-file-input"
                                        name="productImage" type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Footer — always visible */}
                        <div className="apm-footer">
                            <button type="button" className="apm-btn-cancel" onClick={handleModal}>
                                Cancel
                            </button>
                            <button type="submit" className="apm-btn-submit">
                                <Package style={{ width: 13, height: 13 }} />
                                {edit.isEdit ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}

export default AddProductModal
