import React, { useState, useEffect } from 'react';
import './Comments.css';
import { useLanguage } from '../context/LanguageContext';
import { FaComments, FaPaperPlane, FaThumbtack, FaCheckCircle } from 'react-icons/fa';

const Comments = () => {
  const { language, t } = useLanguage();
  const isID = language === 'ID';

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);

  // Load comments from localStorage or initialize with default comments
  useEffect(() => {
    const savedComments = localStorage.getItem('portfolio_comments_v3');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      const adminTime = new Date();
      adminTime.setDate(adminTime.getDate() - 3);

      const userTime = new Date();
      userTime.setHours(userTime.getHours() - 24);

      const defaultComments = [
        {
          id: 1,
          name: "Atama",
          isAdmin: true,
          isVerified: true,
          isPinned: true,
          message: "Thank you for visiting! If you have any questions, feel free to contact me via email or DM.",
          timestamp: adminTime.toISOString()
        },
        
      ];
      setComments(defaultComments);
      localStorage.setItem('portfolio_comments_v3', JSON.stringify(defaultComments));
    }
  }, []);

  // Listen for admin changes from the ChatBot
  useEffect(() => {
    const handleCommentsUpdate = () => {
      const savedComments = localStorage.getItem('portfolio_comments_v3');
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      } else {
        setComments([]);
      }
    };
    window.addEventListener('portfolio_comments_updated', handleCommentsUpdate);
    return () => window.removeEventListener('portfolio_comments_updated', handleCommentsUpdate);
  }, []);

  // Handle Relative Time Ticking
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (isoString) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now - past;
    
    if (diffMs < 0) return isID ? "baru saja" : "just now";

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) {
      return isID ? "baru saja" : "just now";
    } else if (diffMin < 60) {
      return isID ? `${diffMin}m yang lalu` : `${diffMin}m ago`;
    } else if (diffHr < 24) {
      return isID ? `${diffHr}j yang lalu` : `${diffHr}h ago`;
    } else {
      if (diffDay === 1) return isID ? "1 hari yang lalu" : "1d ago";
      return isID ? `${diffDay} hari yang lalu` : `${diffDay}d ago`;
    }
  };

  // Submit new comment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      isAdmin: false,
      isPinned: false,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem('portfolio_comments_v3', JSON.stringify(updatedComments));

    // Clear form
    setName('');
    setMessage('');
  };

  // Sort comments: pinned comments always stay at the top, others sorted by newest first
  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="comments-card glass">
      
      {/* Header */}
      <div className="comments-card-header">
        <div className="comments-card-title-container">
          <h2 className="comments-card-title">
            {t('comments.title')} <span className="comments-card-count">({comments.length})</span>
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="comments-card-form">
        {/* Name Input */}
        <div className="comments-form-group">
          <label className="comments-form-label">
            {t('comments.label.name')} <span className="comments-required">*</span>
          </label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('comments.placeholder.name')}
            required
            maxLength={50}
            className="comments-card-input"
          />
        </div>

        {/* Message Input */}
        <div className="comments-form-group">
          <label className="comments-form-label">
            {t('comments.label.message')} <span className="comments-required">*</span>
          </label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('comments.placeholder.message')}
            required
            maxLength={300}
            rows={4}
            className="comments-card-textarea"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="comments-card-submit-btn">
          <FaPaperPlane className="comments-submit-icon" />
          {t('comments.button.post')}
        </button>
      </form>

      {/* Comments List Area */}
      <div className="comments-card-list-wrapper">
        <div className="comments-card-list">
          {sortedComments.length === 0 ? (
            <div className="comments-list-empty">
              {isID ? "Belum ada komentar." : "No comments yet."}
            </div>
          ) : (
            sortedComments.map((comment) => (
              <div key={comment.id} className={`comment-card-item ${comment.isPinned ? 'pinned' : ''}`}>
                {comment.isPinned && (
                  <div className="comment-card-pinned-tag">
                    <FaThumbtack className="comment-card-pinned-icon" />
                    {t('comments.tag.pinned')}
                  </div>
                )}
                
                <div className="comment-card-body">
                  {/* Left Column: Initials Avatar (Photo-Free Mock Style) */}
                  <div className="comment-card-avatar-wrapper">
                    {comment.isAdmin ? (
                      <div className="comment-card-avatar admin-avatar">A</div>
                    ) : (
                      <div className="comment-card-avatar">
                        {comment.name ? comment.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Message details */}
                  <div className="comment-card-content">
                    <div className="comment-card-header-meta">
                      <div className="comment-card-author-wrapper">
                        <span className="comment-card-author">{comment.name}</span>
                        {(comment.isVerified || comment.isAdmin) && (
                          <FaCheckCircle className="comment-card-verified-icon" title="Verified Creator" />
                        )}
                        {comment.isAdmin && (
                          <span className="comment-card-admin-badge">Admin</span>
                        )}
                      </div>
                      <span className="comment-card-time">
                        {getRelativeTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="comment-card-message">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Comments;
