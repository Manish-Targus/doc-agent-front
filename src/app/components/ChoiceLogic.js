// components/ChoiceView.js
import React from 'react';
import { Cloud, MessageSquare } from 'lucide-react';
import ActionCard from './ActionCard';
import styles from './ChoiceView.module.css';

export default function ChoiceView({ onChoice }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>What's on your mind?</h1>
                <p className={styles.subtitle}>Select an action to proceed</p>
            </div>

            <div className={styles.grid}>
                <ActionCard
                    theme="slate"
                    icon={<Cloud size={32} />}
                    title="Upload Documents"
                    description="Add new PDF, DOCX, or TXT files to your knowledge base."
                    buttonText="Go to Upload"
                    onClick={() => onChoice('upload')}
                />
                <ActionCard
                    theme="amber"
                    icon={<MessageSquare size={32} />}
                    title="Chat with AI"
                    description="Ask questions and extract insights from your files."
                    buttonText="Start Chatting"
                    onClick={() => onChoice('dashboard')}
                />
            </div>
        </div>
    );
}