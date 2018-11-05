### Placing widgets
#### A simple layout
Display my_first_widget only on primary screen
Display my_second_widget only on screen two
Add a background color to my_fourth_widget
Dispose in a wibox.layout.fixed.horizontal layout

Code:
```
s.mywibox : setup {
    {
        layout = awful.widget.only_on_screen,
        screen = "primary", -- Only display on primary screen
        my_first_widget,
    },
    --{
    --    layout = awful.widget.only_on_screen,
    --    screen = 2, -- Only display on screen 2
    --    my_second_widget,
    --},
    my_third_widget, -- Displayed on all screens
    { -- Add a background color/pattern for my_fourth_widget
          my_fourth_widget,
          bg     = beautiful.bg_focus,
          widget = wibox.container.background,
    },
    layout = wibox.layout.fixed.horizontal,
}
```
This examples uses the awful.widget.only_on_screen container to display widgets only on some screens.


### Composite widgets
### Usage example

-- The progressbars will be on top of each other
 local mycpubar1 = wibox.widget {
    { value  = 0.2, color = grad1,
        widget = wibox.widget.progressbar },
    { value  = 0.4, color = grad2,
        widget = wibox.widget.progressbar },
    { value  = 0.6, color = grad3,
        widget = wibox.widget.progressbar },
    layout = wibox.layout.flex.vertical,
 }
-- Now, add a rotate container, the height will become the width.
-- It act as if the wibox.layout.flex.vertical was
-- wibox.layout.flex.horizontal
 local mycpubar2 = wibox.widget {
    {
        { value  = 0.2, color = grad1,
            widget = wibox.widget.progressbar },
        { value  = 0.4, color = grad2,
            widget = wibox.widget.progressbar },
        { value  = 0.6, color = grad3,
            widget = wibox.widget.progressbar },
        layout = wibox.layout.flex.vertical,
    },
    direction = 'east',
    widget    = wibox.container.rotate
 }
