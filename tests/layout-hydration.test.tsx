import { describe, expect, it } from 'vitest';
import RootLayout from '../app/layout';

describe('RootLayout hydration guards', () => {
  it('suppresses hydration warnings on the html root element', () => {
    const element = RootLayout({ children: <div>content</div> });

    expect(element.props.suppressHydrationWarning).toBe(true);
  });
});
