import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './FeedbackWp.module.scss';
import { IFeedbackWpProps } from './IFeedbackWpProps';
import { FeedbackService } from '../services/FeedbackService';

type FeedbackState = 'loading' | 'voting' | 'commentPending' | 'submitted' | 'noActivePrompt';

const FeedbackWp: React.FC<IFeedbackWpProps> = (props) => {
  const [state, setState] = useState<FeedbackState>('loading');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userHash, setUserHash] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [promptId, setPromptId] = useState<number>(0);

  const feedbackService = React.useMemo(
    () => new FeedbackService(props.context),
    [props.context]
  );

  // On mount: get the active prompt, compute the hash, and check if
  // this user already responded to THIS prompt specifically.
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const activePrompt = await feedbackService.getActivePrompt();

      if (!activePrompt) {
        setState('noActivePrompt');
        return;
      }

      setQuestionText(activePrompt.Title);
      setPromptId(activePrompt.Id);

      const loginName = props.context.pageContext.user.loginName;
      const hash = await feedbackService.hashUserIdentity(loginName);
      setUserHash(hash);

      const alreadyResponded = await feedbackService.hasUserResponded(hash, activePrompt.Id);
      setState(alreadyResponded ? 'submitted' : 'voting');
    };

    initialize().catch((error) => {
      console.error('Failed to initialize feedback prompt:', error);
      setState('noActivePrompt');
    });
  }, [feedbackService, props.context]);

  const handleLike = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await feedbackService.addResponse(true, '', userHash, promptId);
      setState('submitted');
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDislikeClick = (): void => {
    setState('commentPending');
  };

  const handleSubmitDislike = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await feedbackService.addResponse(false, comment, userHash, promptId);
      setState('submitted');
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state === 'loading') {
    return <div className={styles.feedbackWp} />;
  }

  if (state === 'noActivePrompt') {
    // No prompt currently marked Active in FeedbackPrompts — nothing to show.
    return null;
  }

  if (state === 'submitted') {
    return (
      <div className={styles.feedbackWp}>
        <p className={styles.thankYou}>Thanks for your feedback!</p>
      </div>
    );
  }

  if (state === 'commentPending') {
    return (
      <div className={styles.feedbackWp}>
        <p className={styles.prompt}>{questionText}</p>
        <textarea
          className={styles.commentBox}
          placeholder="Tell us more (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className={styles.submitButton}
          disabled={isSubmitting}
          onClick={handleSubmitDislike}
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className={styles.feedbackWp}>
      <p className={styles.prompt}>{questionText}</p>
      <div className={styles.voteButtons}>
        <button
          className={styles.thumbButton}
          disabled={isSubmitting}
          onClick={handleLike}
          aria-label="Yes, this was helpful"
        >
          👍 Yes
        </button>
        <button
          className={styles.thumbButton}
          disabled={isSubmitting}
          onClick={handleDislikeClick}
          aria-label="No, this was not helpful"
        >
          👎 No
        </button>
      </div>
    </div>
  );
};

export default FeedbackWp;
