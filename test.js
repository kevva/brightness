import test from 'ava';
import fn from './';

test('should get brightness', async t => {
	const brightness = await fn.get();
	t.is(typeof brightness, 'number');
});

test('should set brightness', async t => {
	await fn.set(0.5);
	const brightness = await fn.get();
	t.is(Math.round(brightness * 10) / 10, 0.5);
});
