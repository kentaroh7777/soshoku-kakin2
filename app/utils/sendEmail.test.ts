import { describe, it, expect, vi } from 'vitest';
import sendEmail from './sendEmail';

describe('sendEmail', () => {
  it('should send an email successfully', async () => {
    const to = 'kabuco.h@gmail.com';
    const subject = 'Test Subject';
    const text = 'Test email body';

    await sendEmail(to, subject, text);
  });

});
