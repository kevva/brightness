import test from 'ava';
import m from './';

test('should get brightness', async t => {
	const brightness = await m.get();
	t.is(typeof brightness, 'number');
});

test('should set brightness', async t => {
	await m.set(0.5);
	const brightness = await m.get();
	t.is(Math.round(brightness * 10) / 10, 0.5);
});
