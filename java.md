#### 在java的jpanel绘制图形

使用paint方法,在里面使用super.paint清除之前的残留
在while里使用repaint进行循环绘画
```
public void display() {
		this.repaint();
	}
	public void paint(Graphics g) {
		super.paint(g);
		dao.drawBackground(g);
		dao.drawState(g, hero);
	}
```

```
while(true) {
			start.display();
			try
			{
				Thread.sleep(300);

			}
			catch (InterruptedException e)
			{
				e.printStackTrace();
			}
		}
```
#### java多线程
