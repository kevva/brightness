<h1 align="center">
	<br>
	<img width="360" src="https://rawgit.com/kevva/brightness/master/media/logo.svg" alt="brightness">
	<br>
	<br>
	<br>
</h1>

> Change the screen brightness


## Install

```
$ npm install --save brightness
```


## Usage

```js
const brightness = require('brightness');

brightness.get().then(level => {
	console.log(level);
	//=> 0.5
});

brightness.set(0.8).then(() => {
	console.log('Changed brightness to 80%');
});
```


## API

### .get()

Returns a promise for the current brightness level.

### .set(level)

Set brightness level.

#### level

*Required*  
Type: `number`

A number between `0` and `1`.


## Related

* [brightness-cli](https://github.com/kevva/brightness-cli) - CLI for this module


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
